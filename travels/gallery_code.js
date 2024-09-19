var locations = ['Entering_Detroit', 'Ann_Arbor', 'Toledo_Suburb', 'Indiannapolis_Wal-Mart', 'Nashville_Indiana', 'Mammoth_Cave',
  'Nashville', 'Outdoor_World', 'Smoky_Mountains', 'Atlanta', 'Savannah_Farm', 'Jacksonville', 
  'Universal_Studios_Orlando', 'Disney_Animal_Kingdom', 'Disney_Magic_Kingdom', 'Disney_Epcot',
  'Florida_Everglades', 'Key_West', 'Port_Charlotte', 'Tampa', 'Florida_Campsite', 'New_Orleans',
  'Texas_Wal-Mart', 'Houston', 'Austin', 'San_Antonio', 'Fort_Clark_Campsite', 'Marathon_Texas',
  'Big_Bend', 'BLM_Campsite', 'Carlsbad_Caverns', 'Guadalupe_Mountains', 'White_Sands', 'Dog_Canyon',
  'Very_Large_Array', 'Los_Alamos', 'Mesa_Verde', 'Ship_Rock', 'Flagstaff', 'Sedona', 'Grand_Canyon',
  'Bryce_Canyon', 'Kodachrome_Park', 'Capitol_Reef', 'Larb_Hollow_Overlook', 'Zion_Park', 'Natural_Bridges',
  'Arches_Park', 'Canyonlands', 'Black_Canyon_of_the_Gunnison', 'Aspen', 'Denver', 'Boulder', 
  'Rocky_Mountains_National_Park', 'Grand_Teton_National_Park', 'Yellowstone', 'Idaho_Hostel', 
  'Salt_Lake_City', 'Antelope_Island', 'Bonneville_Salt_Flats', 'Great_Basin_National_Park', 'Lake_Tahoe',
  'Road_To_Yosemite', 'Yosemite', "Sequioa_and_King's_Canyon", 'Los_Angeles', 'Universal_Studios_Hollywood',
  'Pinnacles_National_Park', 'Big_Sur', 'San_Francisco', 'Redwoods', "Thor's_Well", 'Cannon_Beach', 
  'Washington_Campground', 'Seattle', 'Glacier_National_Park', 'Black_Hills', 'Badlands',
  'Chicago', 'Exiting_Through_Detroit']

$('.justified-gallery').each(function (i, el) {
  $(el).justifiedGallery({rel: location[i], rowHeight : 100}).on('jg.complete', function () {
      $(this).find('a').colorbox({
          maxWidth : '95%',
          maxHeight : '95%',
          current : ''
      });
  });
});