import React, { useRef, useState } from 'react';

const LogoUpload = ({ logo, setLogo }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Invalid image file'));
      };
    });
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    setError('');

    if (file && file.type.includes('image')) {
      try {
        const { width, height, aspectRatio } = await validateImage(file);
        
        // Check dimensions and aspect ratio
        if (aspectRatio < 1 || aspectRatio > 4) {
          setError('Please use a landscape oriented logo (width greater than height)');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setLogo(e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error processing image. Please try another file.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-medium text-gray-900">Company Logo</h3>
        <span className="text-sm text-gray-500">Recommended size: 200×80px</span>
      </div>
      
      <div className="space-y-4">
        {logo && (
          <div className="p-4 border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <img 
                src={logo} 
                alt="Company logo" 
                className="max-h-[100px] max-w-[300px] object-contain"
              />
              <button
                onClick={() => {
                  setLogo(null);
                  setError('');
                }}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-4"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex items-center space-x-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
          >
            {logo ? 'Change Logo' : 'Upload Logo'}
          </button>
          <span className="text-sm text-gray-500">
            PNG, JPG, GIF up to 1MB
          </span>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleLogoUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default LogoUpload;