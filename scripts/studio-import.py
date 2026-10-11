"""
Import the Design Studio's films and stills into public/ai/.

    python scripts/studio-import.py <root> [--force]

<root> is the folder the paths in FILMS and STILLS are relative to (the
exports as they arrived: V/Horizontal, V/Square, V/Vertical and New/). Each
output is skipped if it already exists, unless --force.

Films, w01 upwards, each used twice:

  public/ai/reel/NN-<id>-<shape>.mp4
        a five-second silent loop for the hero tunnel: 270 px on the short
        side (320 for squares), a few hundred KB, from a third of the way in.
  public/ai/work/wNN.mp4
        the film itself for the portfolio and viewer: 720 on the short side,
        30fps, audio kept, at most 20 seconds, cut at the last scene change
        between 12 and 20 seconds where there is one (else at 18), audio faded.

Stills, numbered after the films, also used twice:

  public/ai/reel/NN-<id>-<shape>.webp   a 360 px tile for the tunnel
  public/ai/work/wNN.webp               1600 px on the long side

The order here is the order of WORK in src/content/studio.ts. Then run
`pnpm studio:media` for the films' posters, and rebuild.
"""

import json
import os
import re
import subprocess
import sys

ROOT_IN = sys.argv[1]
FORCE = '--force' in sys.argv
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, 'public', 'ai', 'work')
REEL = os.path.join(ROOT, 'public', 'ai', 'reel')
MAX = 20.0
LOOP = 5.0

FILMS = [
    'V/Horizontal/video.9511a01d.mp4', 'V/Vertical/video.b8abaf29.mp4',
    'V/Horizontal/video.cb135564.mp4', 'V/Square/video.fad481cb.mp4',
    'V/Horizontal/video.cb0e49d7.mp4', 'V/Vertical/video.26faebb4.mp4',
    'V/Horizontal/video.62ee68b3.mp4', 'V/Horizontal/video.db5a6c9e.mp4',
    'V/Vertical/video.eeeced35.mp4', 'V/Horizontal/video.c1ad3270.mp4',
    'V/Square/video.d79b7c51.mp4', 'V/Horizontal/video.5a7ba33c.mp4',
    'V/Vertical/video.90d87aa7.mp4', 'V/Horizontal/video.bff19905.mp4',
    'V/Horizontal/video.0317bbf8.mp4', 'V/Vertical/video.3e901a54.mp4',
    'V/Horizontal/video.16d626c4.mp4', 'V/Horizontal/video.704a596e.mp4',
    'V/Square/video.b1706ba4.mp4', 'V/Horizontal/video.aab49a20.mp4',
    'V/Vertical/video.218acf70.mp4', 'V/Horizontal/video.3da338fe.mp4',
    'V/Horizontal/video.ba2087f8.mp4', 'V/Horizontal/video.f6307a0b.mp4',
    'V/Vertical/video.528199dd.mp4', 'V/Horizontal/video.b1a5599e.mp4',
    'V/Horizontal/video.09e49f4c.mp4', 'V/Horizontal/video.73346413.mp4',
    'V/Horizontal/video.e5fb6874.mp4', 'V/Horizontal/video.dd7606fd.mp4',
    # Second delivery.
    'New/video.45c0b958.mp4', 'New/video.758fe049.mp4', 'New/video.783005a8.mp4',
    'New/video.a48723f7.mp4', 'New/video.ae081140.mp4',
]

STILLS = [
    'New/1773449962594s_1000x1000.webp',
    'New/skincare-product-photography.webp',
    'New/a78f95d0d80f9d3f5f5ee52f102d7a00dde7d1c7-1440x1080.png',
    'New/v3b-tAo0x8GZC-uNoF2Nhp3TU_bsVOxFi1.png',
    'New/images (14).jpeg',
    'New/images (15).jpeg',
    'New/images (16).jpeg',
    'New/images (17).jpeg',
    # Third delivery: real estate, construction, trades and home.
    'New2/01-6.webp', 'New2/02-7.webp', 'New2/03-8.webp', 'New2/04-9.webp',
    'New2/05-10.webp', 'New2/06-12.webp', 'New2/07-13.webp', 'New2/08-14.webp',
    'New2/09-15.webp', 'New2/10-16.webp',
]

# Stills kept out of the hero tunnel (portfolio and showcase only), so the
# tunnel stays mostly motion. By position in STILLS, counted from 1.
NOT_IN_TUNNEL = {17}

# Films added after the stills, numbered after them so nothing renumbers.
LATE_FILMS = [
    '82772c0a-9518-472c-9825-3d84b74f3ee0.mp4',
    'a7c2bc28-b911-42a8-a9ac-0c6151a21324.mp4',
    '326c512a-ee04-417d-bb2a-faa3f2d1c6d1.mp4',
]

# Software demos kept out of the hero tunnel (portfolio only), so the hero
# reads as many industries rather than SaaS. By w number.
FILMS_NOT_IN_TUNNEL = {1, 17, 26, 32}


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True)


def probe(path):
    out = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
               'stream=width,height:format=duration', '-of', 'json', path]).stdout
    data = json.loads(out)
    s = data['streams'][0]
    dur = float(data.get('format', {}).get('duration', 0) or 0)
    has_audio = run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries',
                     'stream=index', '-of', 'csv=p=0', path]).stdout.strip() != ''
    return s['width'], s['height'], dur, has_audio


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
    if r > 1.6:
        return '16x9'
    if r > 1.42:
        return '3x2'
    if r > 1.15:
        return '4x3'
    if r < 0.62:
        return '9x16'
    if r < 0.72:
        return '2x3'
    if r < 0.9:
        return '4x5'
    return '1x1'


def stem(path):
    name = os.path.splitext(os.path.basename(path))[0]
    name = name.replace('video.', '')
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')[:12]


def done(path):
    return os.path.exists(path) and not FORCE


os.makedirs(WORK, exist_ok=True)
os.makedirs(REEL, exist_ok=True)

def film(n, rel):
    src = os.path.join(ROOT_IN, rel)
    w, h, dur, audio = probe(src)
    sh = shape(w, h)
    out = os.path.join(WORK, f'w{n:02d}.mp4')
    reel = os.path.join(REEL, f'{n:02d}-{stem(rel)}-{sh}.mp4')
    cut = best_cut(src, dur)
    if not done(out):
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
    if n in FILMS_NOT_IN_TUNNEL:
        if os.path.exists(reel):
            os.remove(reel)
    elif not done(reel):
        start = round(min(max(1.0, cut * 0.33), max(0.0, cut - LOOP)), 2)
        rscale = {'16x9': 'scale=-2:270', '3x2': 'scale=-2:270', '4x3': 'scale=-2:270',
                  '9x16': 'scale=270:-2', '2x3': 'scale=270:-2', '4x5': 'scale=288:-2',
                  '1x1': 'scale=320:320'}[sh]
        run(['ffmpeg', '-v', 'error', '-y', '-ss', str(start), '-i', src, '-t', str(LOOP), '-vf',
             f'{rscale},fps=30,format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'slow',
             '-crf', '30', '-maxrate', '700k', '-bufsize', '1400k', '-movflags', '+faststart', reel])
    print(f'w{n:02d}  film  {sh:5s} {dur:5.1f}s -> {cut:5.1f}s  {rel}', flush=True)


for n, rel in enumerate(FILMS, start=1):
    film(n, rel)

for k, rel in enumerate(STILLS, start=len(FILMS) + 1):
    src = os.path.join(ROOT_IN, rel)
    w, h, _, _ = probe(src)
    sh = shape(w, h)
    out = os.path.join(WORK, f'w{k:02d}.webp')
    reel = os.path.join(REEL, f'{k:02d}-{stem(rel)}-{sh}.webp')
    if not done(out):
        big = 'scale=1600:-2' if w >= h else 'scale=-2:1600'
        big = f"{big.split(':')[0]}:{big.split(':')[1]}" if max(w, h) > 1600 else 'null'
        run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', big, '-c:v', 'libwebp',
             '-quality', '82', out])
    if (k - len(FILMS)) in NOT_IN_TUNNEL:
        if os.path.exists(reel):
            os.remove(reel)
    elif not done(reel):
        small = 'scale=-2:360' if w >= h else 'scale=360:-2'
        run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', small, '-c:v', 'libwebp',
             '-quality', '78', reel])
    print(f'w{k:02d}  still {sh:5s} {w}x{h}  {rel}', flush=True)

for m, rel in enumerate(LATE_FILMS, start=len(FILMS) + len(STILLS) + 1):
    film(m, rel)
