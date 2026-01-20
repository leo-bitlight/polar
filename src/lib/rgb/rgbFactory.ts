import { RLightningNode } from 'shared/types';
import RgbService from './rgbService';

export default class RgbFactory {
  /**
   * The mapping of implementation types to services
   */
  private _services: Record<string, any>;

  constructor() {
    this._services = {
      rgb: RgbService,
    };
  }

  /**
   * Returns a TAP service for the given node
   * @param node the TAP node object
   */
  getService(node: RLightningNode): RgbService {
    return this._services[node.implementation];
  }
}
