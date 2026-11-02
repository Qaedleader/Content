import {Config} from '@remotion/cli/config';

// Tuned for an 8 GB machine: one Chromium tab, JPEG frames, H.264 high quality.
Config.setConcurrency(1);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setChromiumOpenGlRenderer('angle');
Config.setOffthreadVideoCacheSizeInBytes(512 * 1024 * 1024);
