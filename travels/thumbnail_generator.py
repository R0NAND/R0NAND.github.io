import os
from PIL import Image, ExifTags

# Set the directory containing the JPEG files
input_dir = "C:/Users/rodaw/OneDrive/Desktop/USA_Photos"

# Set the maximum width for thumbnails
max_width = 100

def correct_orientation(img):
    try:
        # Get the EXIF metadata (if present)
        exif = img._getexif()
        
        if exif is not None:
            # Get orientation tag code
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == 'Orientation':
                    break
            
            # Get the orientation value
            exif_orientation = exif.get(orientation, None)
            
            # Correct the orientation if necessary
            if exif_orientation == 3:
                img = img.rotate(180, expand=True)
            elif exif_orientation == 6:
                img = img.rotate(270, expand=True)
            elif exif_orientation == 8:
                img = img.rotate(90, expand=True)
        
    except (AttributeError, KeyError, IndexError):
        # Cases: image does not have EXIF data or no orientation tag
        pass
    
    return img

def create_thumbnail(input_path, output_path):
    # Open an image file
    with Image.open(input_path) as img:
        # Correct the orientation if needed
        img = correct_orientation(img)

        # Calculate the new height maintaining the aspect ratio
        width_percent = max_width / float(img.size[0])
        new_height = int(float(img.size[1]) * width_percent)
        
        # Resize the image
        img = img.resize((max_width, new_height), Image.ANTIALIAS)
        
        # Save the thumbnail image
        img.save(output_path, 'JPEG')

def process_images(input_dir):
    # Loop through all files in the input directory
   for root, dirs, files in os.walk(input_dir):
        # Create the output directory if it doesn't exist
        thumbnails_output = os.path.join(root, 'thumbnails')
        os.makedirs(thumbnails_output, exist_ok=True)
        for filename in os.listdir(root):
            if filename.lower().endswith('.jpg') or filename.lower().endswith('.jpeg'):
                input_path = os.path.join(root, filename)
                
                # Create the output filename
                name, ext = os.path.splitext(filename)
                output_filename = f"{name}_thumbnail{ext}"
                output_path = os.path.join(thumbnails_output, output_filename)
                
                # Create the thumbnail
                create_thumbnail(input_path, output_path)
                print(f"Created thumbnail: {output_path}")

# Process the images
process_images(input_dir)