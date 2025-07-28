import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { config } from '@/config/environment';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface ConferenceRoomImage {
  id?: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

interface ConferenceRoom {
  id: string;
  name: string;
  type: string;
  price_per_hour: number;
  capacity: number;
  size_sqm: number | null;
  description: string | null;
  amenities: string[];
  image_url: string | null;
  room_number: string | null;
  is_available: boolean;
  images?: ConferenceRoomImage[];
}

interface ConferenceRoomEditDialogProps {
  room: ConferenceRoom | null;
  onClose: () => void;
  onSave: (room: Partial<ConferenceRoom>, images: ConferenceRoomImage[]) => void;
}

const ConferenceRoomEditDialog: React.FC<ConferenceRoomEditDialogProps> = ({ room, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<ConferenceRoom>>({
    name: '',
    type: 'small_meeting_room',
    price_per_hour: 0,
    capacity: 10,
    size_sqm: null,
    description: '',
    amenities: [],
    image_url: '',
    room_number: '',
    is_available: true
  });

  const [images, setImages] = useState<ConferenceRoomImage[]>([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData(room);
      setImages(room.images || []);
    } else {
      setFormData({
        name: '',
        type: 'small_meeting_room',
        price_per_hour: 0,
        capacity: 10,
        size_sqm: null,
        description: '',
        amenities: [],
        image_url: '',
        room_number: '',
        is_available: true
      });
      setImages([]);
    }
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, images);
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities?.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter(a => a !== amenity) || []
    }));
  };

  const addImage = () => {
    const newImage: ConferenceRoomImage = {
      image_url: '',
      alt_text: '',
      display_order: images.length,
      is_primary: images.length === 0
    };
    setImages([...images, newImage]);
  };

  const updateImage = (index: number, field: keyof ConferenceRoomImage, value: string | boolean | number) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setImages(updatedImages);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    updatedImages.forEach((img, i) => {
      img.display_order = i;
    });
    setImages(updatedImages);
  };

  const setPrimaryImage = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    setImages(updatedImages);
  };

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
          return null;
        }

        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image.`);
          return null;
        }

        // Upload image to backend /upload endpoint
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await api.post(`${config.backend.url}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return {
          image_url: uploadRes.data.url,
          alt_text: file.name.split('.')[0],
          display_order: images.length + index,
          is_primary: images.length === 0 && index === 0
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const validImages = uploadedImages.filter(img => img !== null) as ConferenceRoomImage[];
      
      if (validImages.length > 0) {
        setImages(prev => [...prev, ...validImages]);
        toast.success(`Successfully uploaded ${validImages.length} image(s)`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {room ? 'Edit Conference Room' : 'Add New Conference Room'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Conference Room Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="room_number">Room Number</Label>
              <Input
                id="room_number"
                value={formData.room_number || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Conference Room Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="small_meeting_room">Small Meeting Room</SelectItem>
                  <SelectItem value="large_conference_hall">Large Conference Hall</SelectItem>
                  <SelectItem value="boardroom">Boardroom</SelectItem>
                  <SelectItem value="training_room">Training Room</SelectItem>
                  <SelectItem value="seminar_hall">Seminar Hall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price_per_hour">Price per Hour (₦)</Label>
              <Input
                id="price_per_hour"
                type="number"
                value={formData.price_per_hour || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_hour: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="size_sqm">Size (sqm)</Label>
              <Input
                id="size_sqm"
                type="number"
                value={formData.size_sqm || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, size_sqm: parseInt(e.target.value) || null }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Conference Room Images</Label>
            <div className="space-y-4">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload multiple images
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB each
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploading}
                    className="mt-2"
                  >
                    {uploading ? 'Uploading...' : 'Choose Files'}
                  </Button>
                </div>
              </div>

              {/* Display uploaded images */}
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Image {index + 1}</span>
                    <div className="flex gap-2">
                      {!image.is_primary && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPrimaryImage(index)}
                        >
                          Set as Primary
                        </Button>
                      )}
                      {image.is_primary && (
                        <span className="text-sm text-green-600 font-medium">Primary Image</span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Image preview */}
                  {image.image_url && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || `Conference room image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor={`image_url_${index}`}>Image URL</Label>
                    <Input
                      id={`image_url_${index}`}
                      value={image.image_url}
                      onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`alt_text_${index}`}>Alt Text (Optional)</Label>
                    <Input
                      id={`alt_text_${index}`}
                      value={image.alt_text || ''}
                      onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                      placeholder="Descriptive text for the image"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addImage}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image URL Manually
              </Button>
            </div>
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  {amenity}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeAmenity(amenity)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {room ? 'Update Conference Room' : 'Create Conference Room'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConferenceRoomEditDialog;