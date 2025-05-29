import { getCloudAvailability } from './questionUtils';

// Test function for manual testing
export function testCloudAvailability() {
  // Test for Marketing Cloud
  console.log('Marketing Cloud Availability:', getCloudAvailability('marketing'));
  
  // Test for Sales Cloud
  console.log('Sales Cloud Availability:', getCloudAvailability('sales'));
  
  // Test for Service Cloud
  console.log('Service Cloud Availability:', getCloudAvailability('service'));
  
  // Test for Commerce Cloud
  console.log('Commerce Cloud Availability:', getCloudAvailability('commerce'));
  
  // Test for CPQ
  console.log('CPQ Availability:', getCloudAvailability('cpq'));
  
  // Test for Pardot
  console.log('Pardot Availability:', getCloudAvailability('pardot'));
}

// Run the test
testCloudAvailability();
