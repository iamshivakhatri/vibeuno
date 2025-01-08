export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New_Hampshire', 'New_Jersey',
  'New_Mexico', 'New_York', 'North_Carolina', 'North_Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode_Island', 'South_Carolina',
  'South_Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West_Virginia', 'Wisconsin', 'Wyoming'
 ] as const;
 
 export type USState = typeof US_STATES[number];
 
 export function isValidState(state: string): state is USState {
  return US_STATES.includes(state as USState);
 }
 
 export const STATE_IMAGE_URLS: Record<USState, string> = {
  Alabama: 'https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1',
  Alaska: 'https://images.unsplash.com/photo-1515885267349-1fcef6e00fd1',
  Arizona: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722',
  Arkansas: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
  California: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad',
  Colorado: 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47',
  Connecticut: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16',
  Delaware: 'https://images.unsplash.com/photo-1602591051760-3539c8cb8e2a',
  Florida: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64',
  Georgia: 'https://images.unsplash.com/photo-1534889156217-d643df14f14a',
  Hawaii: 'https://images.unsplash.com/photo-1505852903341-fc8d3db10436',
  Idaho: 'https://images.unsplash.com/photo-1599663254335-b454b3cef6ba',
  Illinois: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f',
  Indiana: 'https://images.unsplash.com/photo-1606061011720-8fa5eb5f63c5',
  Iowa: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
  Kansas: 'https://images.unsplash.com/photo-1664733865764-768873659f2c',
  Kentucky: 'https://images.unsplash.com/photo-1637783766937-dc21c1bb7eb6',
  Louisiana: 'https://images.unsplash.com/photo-1549965738-e1aaf1168943',
  Maine: 'https://images.unsplash.com/photo-1587223075055-82e9a937ddff',
  Maryland: 'https://images.unsplash.com/photo-1641057312560-51fd10113cdd',
  Massachusetts: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c',
  Michigan: 'https://images.unsplash.com/photo-1625860838846-8ff25971397b',
  Minnesota: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
  Mississippi: 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff',
  Missouri: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c',
  Montana: 'https://plus.unsplash.com/premium_photo-1676240588949-15624d65f0e1',
  Nebraska: 'https://images.unsplash.com/photo-1567459169668-95d355371bda',
  Nevada: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d',
  New_Hampshire: 'https://images.unsplash.com/photo-1593380604093-abb8c014bc41',
  New_Jersey: 'https://images.unsplash.com/photo-1518803194621-27188ba362c9',
  New_Mexico: 'https://images.unsplash.com/photo-1519810755548-39cd217da494',
  New_York: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee',
  North_Carolina: 'https://images.unsplash.com/photo-1588434487755-e211e0aae297',
  North_Dakota: 'https://images.unsplash.com/photo-1681422049145-d4fcd3890d0f',
  Ohio: 'https://images.unsplash.com/photo-1501631454901-2fe040439c00',
  Oklahoma: 'https://images.unsplash.com/photo-1730255869060-d76dbd32d3c4',
  Oregon: 'https://images.unsplash.com/photo-1602966291194-30c55717c607',
  Pennsylvania: 'https://images.unsplash.com/photo-1569761316261-9a8696fa2ca3',
  Rhode_Island: 'https://images.unsplash.com/photo-1574305374536-bf27e3de5310',
  South_Carolina: 'https://plus.unsplash.com/premium_photo-1694475442325-4e0055fe2dac',
  South_Dakota: 'https://plus.unsplash.com/premium_photo-1694475335448-1c0d17b94a63',
  Tennessee: 'https://plus.unsplash.com/premium_photo-1733335204008-9cd84e3d98ac',
  Texas: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934',
  Utah: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
  Vermont: 'https://images.unsplash.com/photo-1612485222394-376d81a3e829',
  Virginia: 'https://plus.unsplash.com/premium_photo-1697730020369-ee69d96d1c21',
  Washington: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362',
  West_Virginia: 'https://images.unsplash.com/photo-1694963581210-77415183090d',
  Wisconsin: 'https://images.unsplash.com/photo-1596464148416-e0916276a9f5',
  Wyoming: 'https://plus.unsplash.com/premium_photo-1673264933165-54c366bece8f'
 };
 
 export function getStateImageUrl(state: string): string {
  return STATE_IMAGE_URLS[state as USState];
 }