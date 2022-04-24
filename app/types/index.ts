export interface Site {
  siteId: string;
  name: string;
  description: string;
  transformParameters: {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scaleFactor: number;
  };
}
