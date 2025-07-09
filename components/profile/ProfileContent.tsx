import { FiEdit } from 'react-icons/fi';
import Image from 'next/image';

interface ProfileContentProps {
  profileImage: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
}

export default function ProfileContent({ 
  profileImage, 
  onImageUpload, 
  onDeleteImage 
}: ProfileContentProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-title_black mb-6">Profile Information</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <Image
              src={profileImage}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full border-4 border-white/30 object-cover"
            />
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <FiEdit className="text-white text-xl" />
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <button 
            onClick={onDeleteImage}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove Photo
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Name</label>
          <input
            type="text"
            defaultValue="Alex Cooper"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Email</label>
          <input
            type="email"
            defaultValue="alexcooper@gmail.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Location</label>
          <input
            type="text"
            defaultValue="California, US"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-desc_gray mb-1">Bio</label>
          <textarea
            defaultValue="Working as a professor in Oxford university."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary_green focus:border-transparent"
          />
        </div>
        <button className="mt-4 bg-primary_green text-white px-6 py-2 rounded-lg hover:bg-primary_green/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}