import ffmpeg from 'fluent-ffmpeg';
import ffprobe from 'ffprobe-static';

// Set the ffprobe path for fluent-ffmpeg
ffmpeg.setFfprobePath(ffprobe.path);

const getVideoDuration = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .ffprobe((err: any | null, metadata: ffmpeg.FfprobeData) => {
        if (err) {
          return reject(err);
        }
        const duration = metadata.format.duration;
        if (typeof duration === 'number') {
          resolve(duration);
        } else {
          reject(new Error('Duration not found'));
        }
      });
  });
};

export default getVideoDuration;
