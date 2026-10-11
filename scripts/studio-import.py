"""
Import the Design Studio's films into public/ai/.

    python scripts/studio-import.py <source-folder>

The source folder holds Horizontal/, Square/ and Vertical/ subfolders of
finished films, as exported. Every film is used twice:

  public/ai/reel/NN-<id>-<shape>.mp4
        a five-second silent loop for the hero tunnel: 270 px on the short
        side (320 for squares), a few hundred KB, taken from a third of the way
        in so it starts past any title card. The shape in the name sets the
        tile's proportions.
  public/ai/work/wNN.mp4
        the film itself, for the portfolio, the viewer and the sections that
        borrow from it: 720 on the short side, 30fps, audio kept, at most
        20 seconds. A longer film is cut at its last scene change between 12
        and 20 seconds (ffmpeg's scene detector), or at 18 seconds failing
        that, with the audio faded out.

NN follows SOURCES below, which is also the order of w01..w30 in WORK in
src/content/studio.ts. Anything in the folder that is not listed is appended,
so nothing is missed (give it a WORK entry). Then run `pnpm studio:media` for
posters and rebuild.
"""

import json
import os
import re
import subprocess
import sys

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, 'public', 'ai', 'work')
REEL = os.path.join(ROOT, 'public', 'ai', 'reel')
MAX = 20.0
LOOP = 5.0

SOURCES = [
    ('Horizontal', '9511a01d'), ('Vertical', 'b8abaf29'), ('Horizontal', 'cb135564'),
    ('Square', 'fad481cb'), ('Horizontal', 'cb0e49d7'), ('Vertical', '26faebb4'),
    ('Horizontal', '62ee68b3'), ('Horizontal', 'db5a6c9e'), ('Vertical', 'eeeced35'),
    ('Horizontal', 'c1ad3270'), ('Square', 'd79b7c51'), ('Horizontal', '5a7ba33c'),
    ('Vertical', '90d87aa7'), ('Horizontal', 'bff19905'), ('Horizontal', '0317bbf8'),
    ('Vertical', '3e901a54'), ('Horizontal', '16d626c4'), ('Horizontal', '704a596e'),
    ('Square', 'b1706ba4'), ('Horizontal', 'aab49a20'), ('Vertical', '218acf70'),
    ('Horizontal', '3da338fe'), ('Horizontal', 'ba2087f8'), ('Horizontal', 'f6307a0b'),
    ('Vertical', '528199dd'), ('Horizontal', 'b1a5599e'), ('Horizontal', '09e49f4c'),
    ('Horizontal', '73346413'), ('Horizontal', 'e5fb6874'), ('Horizontal', 'dd7606fd'),
]


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


def probe(path):
    out = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
               'stream=width,height:format=duration', '-of', 'json', path]).stdout
    data = json.loads(out)
    s = data['streams'][0]
    has_audio = run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries',
                     'stream=index', '-of', 'csv=p=0', path]).stdout.strip() != ''
    return s['width'], s['height'], float(data['format']['duration']), has_audio


def best_cut(path, duration):
    if duration <= MAX:
        return duration
    res = subprocess.run(['ffmpeg', '-hide_banner', '-t', str(MAX + 0.5), '-i', path, '-vf',
                          "select='gt(scene,0.25)',showinfo", '-an', '-f', 'null', '-'],
                         capture_output=True, text=True)
    cuts = [float(m) for m in re.findall(r'pts_time:([\d.]+)', res.stderr)]
    good = [c for c in cuts if 12.0 <= c <= MAX]
    return round(max(good) - 0.04, 2) if good else 18.0


def shape(w, h):
    r = w / h
    return '16x9' if r > 1.3 else ('9x16' if r < 0.75 else '1x1')


listed = {vid for _, vid in SOURCES}
for folder in ('Horizontal', 'Square', 'Vertical'):
    path = os.path.join(SRC, folder)
    if not os.path.isdir(path):
        continue
    for name in sorted(os.listdir(path)):
        if name.startswith('video.') and name.endswith('.mp4'):
            vid = name[len('video.'):-len('.mp4')]
            if vid not in listed:
                SOURCES.append((folder, vid))
                listed.add(vid)

os.makedirs(WORK, exist_ok=True)
os.makedirs(REEL, exist_ok=True)
for n, (folder, vid) in enumerate(SOURCES, start=1):
    src = os.path.join(SRC, folder, f'video.{vid}.mp4')
    w, h, dur, audio = probe(src)
    cut = best_cut(src, dur)
    sh = shape(w, h)

    out = os.path.join(WORK, f'w{n:02d}.mp4')
    scale = 'scale=-2:720' if w >= h else 'scale=720:-2'
    args = ['ffmpeg', '-v', 'error', '-y', '-i', src, '-t', str(cut), '-vf',
            f'{scale},fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow',
            '-crf', '26', '-maxrate', '2200k', '-bufsize', '4400k', '-movflags', '+faststart']
    if audio:
        fade = f'afade=t=out:st={max(0, cut - 0.5)}:d=0.5' if cut < dur else 'anull'
        args += ['-af', fade, '-c:a', 'aac', '-b:a', '96k']
    else:
        args += ['-an']
    run(args + [out])

    start = round(min(max(1.0, cut * 0.33), max(0.0, cut - LOOP)), 2)
    rscale = 'scale=-2:270' if sh == '16x9' else ('scale=270:-2' if sh == '9x16' else 'scale=320:320')
    reel = os.path.join(REEL, f'{n:02d}-{vid}-{sh}.mp4')
    run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start), '-i', src, '-t', str(LOOP), '-vf',
         f'{rscale},fps=30,format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'slow',
         '-crf', '30', '-maxrate', '700k', '-bufsize', '1400k', '-movflags', '+faststart', reel])
    print(f'w{n:02d}  {folder[0]} {vid}  {dur:5.1f}s -> {cut:5.1f}s  '
          f'{os.path.getsize(out) // 1024:5d} KB  reel {os.path.getsize(reel) // 1024:4d} KB', flush=True)
