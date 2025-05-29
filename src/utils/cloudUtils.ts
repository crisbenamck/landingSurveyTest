/**
 * Get the display name for a cloud type
 * @param cloud The cloud type
 */
export const getCloudDisplayName = (cloud: string): string => {
  switch(cloud) {
    case 'marketing': return 'Marketing Cloud';
    case 'sales': return 'Sales Cloud';
    case 'service': return 'Service Cloud';
    case 'commerce': return 'Commerce Cloud';
    case 'cpq': return 'CPQ';
    case 'pardot': return 'Pardot';
    default: return 'Marketing Cloud';
  }
};
