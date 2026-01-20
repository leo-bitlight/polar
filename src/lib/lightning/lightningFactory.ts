import { LightningNode } from 'shared/types';
import { clightningService } from 'lib/lightning/clightning';
import { eclairService } from 'lib/lightning/eclair';
import { lndService } from 'lib/lightning/lnd';
import { LightningService } from 'types';
import RustLightningService from './rlightning/rlightningService';

/**
 * A factory class used to obtain a Lightning service based on
 * the node's implementation
 */
class LightningFactory {
  /**
   * The mapping of implementation types to services
   */
  private _services: Record<LightningNode['implementation'], LightningService>;

  constructor() {
    this._services = {
      LND: lndService,
      rustlightning: new RustLightningService(),
      'c-lightning': clightningService,
      eclair: eclairService,
      litd: lndService,
    };
  }

  /**
   * Returns a lightning service for the given node
   * @param node the Lightning node object
   */
  getService(node: LightningNode): LightningService {
    return this._services[node.implementation];
  }
}

export default LightningFactory;
