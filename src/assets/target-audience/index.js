/**
 * Target Audience Image Exports
 * This file exports image paths from the target audience data
 */

import targetAudienceImages from '../../data/targetAudienceData';

// Export individual image paths for backward compatibility
export const contentCreatorsImg = targetAudienceImages.contentCreators.path;
export const smallBusinessImg = targetAudienceImages.smallBusiness.path;
export const freelancersImg = targetAudienceImages.freelancers.path;
export const marketingAgenciesImg = targetAudienceImages.marketingAgencies.path;

// Export the full image data object
export default targetAudienceImages;
