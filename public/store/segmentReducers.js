import { simpleHash } from '../helpers/utils';

export function reduceSegmentData(data, sampleName, segment, trackUrl, startByte, endByte) {
  return {
    ...data,
    [sampleName]: {
      id: segment.id,
      uniqueId: segment.id + '__' + simpleHash(trackUrl) + String(Date.now()),
      keyMap: segment.keyMap,
      className: segment.className,
      color: segment.color,
      startTime: segment.startTime,
      endTime: segment.endTime,
      sampleName,
      startByte,
      endByte,
      trackUrl,
    },
  };
}
