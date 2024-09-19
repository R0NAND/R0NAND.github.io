# Set your Cloudinary credentials
# ==============================
from dotenv import load_dotenv
load_dotenv()

# Import the Cloudinary libraries
# ==============================
import cloudinary
from cloudinary import CloudinaryImage
import cloudinary.uploader
import cloudinary.api

import os
import csv
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

def get_exif_data(image):
    exif_data = {}
    info = image._getexif()
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            exif_data[decoded] = value
    return exif_data

def get_if_exist(data, key):
    return data.get(key)

def convert_to_degrees(value):
    d = float(value[0])
    m = float(value[1])
    s = float(value[2])
    return d + (m / 60.0) + (s / 3600.0)

def get_gps_info(exif_data):
    gps_info = {}
    altitude = None
    if 'GPSInfo' in exif_data:
        for key in exif_data['GPSInfo'].keys():
            decoded = GPSTAGS.get(key, key)
            gps_info[decoded] = exif_data['GPSInfo'][key]

        if 'GPSLatitude' in gps_info and 'GPSLatitudeRef' in gps_info and 'GPSLongitude' in gps_info and 'GPSLongitudeRef' in gps_info:
            lat = convert_to_degrees(gps_info['GPSLatitude'])
            if gps_info['GPSLatitudeRef'] != 'N':
                lat = -lat

            lon = convert_to_degrees(gps_info['GPSLongitude'])
            if gps_info['GPSLongitudeRef'] != 'E':
                lon = -lon
            else:
                lat, lon = None, None

            if 'GPSAltitude' in gps_info:
                altitude = gps_info['GPSAltitude']
            if 'GPSAltitudeRef' in gps_info and gps_info['GPSAltitudeRef'] == 1:
                altitude = -altitude  # If reference is 1, the altitude is below sea level
            
            if(altitude != None):
                return lat, lon, int(altitude)
            else:
                return lat, lon, None
    return None, None, None

def extract_info_from_image(image_path):
    image = Image.open(image_path)
    exif_data = get_exif_data(image)
    gps_lat, gps_lon, gps_alt = get_gps_info(exif_data)
    timestamp = get_if_exist(exif_data, 'DateTime')
    return gps_lat, gps_lon, gps_alt, timestamp

output_data = []
def process_directory(directory):
    failed_files = ''
    for file in os.listdir(directory):
        if file.lower().endswith('.jpg') or file.lower().endswith('.jpeg'):
            metadata_string = ''
            file_path = os.path.join(directory, file)
            lat, lon, alt, timestamp = extract_info_from_image(file_path)
            if(lat != None):
                metadata_string += 'latitude=' + str(lat) + '|'
            if(lon != None):
                metadata_string += 'longitude=' + str(lon) + '|'
            if(alt != None):
                metadata_string += 'altitude=' + str(alt) + '|'
            metadata_string += 'timestamp=' + timestamp
            print("uploading: " + os.path.join(directory, file))
            if(os.path.getsize(os.path.join(directory, file)) < 10485760):
                cloudinary.uploader.upload(os.path.join(directory, file), tags=[os.path.split(directory)[1]], 
                                        metadata=metadata_string)
                print("success!")
            else:
                failed_files += os.path.join(directory, file) + "\n"
    return failed_files
# Set configuration parameter: return "https" URLs by setting secure=True  
                
                # output_data.append([file_path, lat, lon, alt, timestamp])

    # return output_data

def write_to_csv(output_file, data):
    with open(output_file, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['Filepath', 'Latitude', 'Longitude', 'Timestamp'])
        csv_writer.writerows(data)

def output_gallery_string(directory):
    gallery_string = '<h3>' + os.path.basename(directory).replace("_", " ") + '</h3>\n<div class="justified-gallery">\n'
    for file in os.listdir(directory):
        if file.lower().endswith('.jpg') or file.lower().endswith('.jpeg'):
            file_path = os.path.join(directory, file)
            lat, lon, alt, timestamp = extract_info_from_image(file_path)
            if(lat != None):
                idx = file.index('.jp')
                thumbnail_name = file[:idx] + '_thumbnail' + file[idx:]
                gallery_string += '<a><img src="' + os.path.join(directory, 'thumbnails', thumbnail_name) + '" onmouseenter="test_func([' + str(lat) + ',' + str(lon) + '])"/></a>\n'

    gallery_string += "</div>\n"
    return gallery_string

if __name__ == '__main__':
    directory = "C:/Users/rodaw/OneDrive/Desktop/USA_Photos"  # Replace with your directory
    output_file = 'output.csv'
    output_html = ''
    failures = ''
    for root in os.listdir(directory):
        if(os.path.isdir(os.path.join(directory, root))):
            failures += process_directory(os.path.join(directory, root))
            # output_html += output_gallery_string(os.path.join(directory, root))
    # output_html += '<script src="gallery_code.js"></script>'
    print(failures)
    # write_to_csv(output_file, output_data)
    # print(f'Data written to {output_file}')
    # f = open("galleries.html", "w")
    # f.write(output_html)
    # f.close()