export default class PixelsToViewPortUnitConverter {
  private static guidelineBaseWidth = 414; // Style guide for iPhone XS Max Width = 414, height = 896
  private static guidelineBaseHeight = 896;
  public static sScreenPortraitHeight = window.innerHeight;

  private constructor() {}

  public static generateFourDigitRandomNumber(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  public static getvw(target: number) {
    return `${(target / (this.guidelineBaseWidth * 0.01)) * 1}vw`; // vw
  }

  public static getvh(target: number) {
    return `${(target / (this.guidelineBaseHeight * 0.01)) * 1}vh`; // vw
  }

  public static getFontVw(target: number) {
    return `${((target + 1) / (this.guidelineBaseWidth * 0.01)) * 1}vw`; // vw
  }

  public static getFontVh(target: number) {
    return `${((target + 1) / (this.guidelineBaseHeight * 0.01)) * 1}vh`; // vw
  }

  public static getNumericVw(target: number) {
    return ((window.innerWidth * target)/this.guidelineBaseWidth);
  }

  public static getNumericVh(target: number) {
    return ((window.innerHeight * target)/this.guidelineBaseHeight);
  }
}
