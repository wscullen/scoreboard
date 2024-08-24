export const rampAudioUpAndDown = (
  audioRef: React.RefObject<HTMLAudioElement>,
  duration: number,
  rampLength: number = 1000
) => {
  const rampSegmentLength = rampLength / 10;
  let audioScale = 0;
  const volumeRampInterval = setInterval(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioScale;
      audioScale += 0.1;
      if (audioScale >= 1) {
        clearInterval(volumeRampInterval);
      }
    }
  }, rampSegmentLength);

  setTimeout(() => {
    let audioScale = 1;
    const volumeRampInterval = setInterval(() => {
      if (audioRef.current) {
        audioRef.current.volume = audioScale;
        audioScale -= 0.1;
        if (audioScale <= 0) {
          clearInterval(volumeRampInterval);
        }
      }
    }, rampSegmentLength);
  }, duration * 1000 - rampLength);
};
