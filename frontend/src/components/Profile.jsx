import React, { useState, useEffect, useCallback } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    resumeFile: null
  });
  const [resumePreview, setResumePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return;

    async function loadProfile() {
      try {
        const res = await fetch('http://localhost:8080/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          console.error('Failed to fetch profile', res.status);
          return;
        }
        const data = await res.json();
        // data should be { name, email, resumeUrl }
        setProfile({
          name: data.name || '',
          email: data.email || '',
          resumeFile: null               // we never pre-load the File object
        });
        setResumePreview(
          data.resumeUrl
            ? `http://localhost:8080${data.resumeUrl}`
            : null
        );
        setIsEditing(false);             // show the read-only view
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    }

    loadProfile();
  }, []); // run once on mount


  const handleChange = (e) => {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfile(p => ({ ...p, resumeFile: file }));
      setResumePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    if (!token) return alert('Not logged in');

    // build a FormData since you may have a file
    const form = new FormData();
    form.append('name', profile.name);
    form.append('email', profile.email);
    if (profile.resumeFile) {
      form.append('resume', profile.resumeFile);
    }

    const res = await fetch('http://localhost:8080/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // **do not** set Content-Type: browser will do multipart boundary for you
      },
      body: form
    });

    if (!res.ok) {
      console.error('Save failed', await res.text());
      return;
    }

    // grab back your saved fields (optional)
    const saved = await res.json();
    setProfile({ name: saved.name, email: saved.email, resumeFile: null });
    setResumePreview(saved.resumeUrl || null);

    setIsEditing(false);
  };


  if (!isEditing) {
    // Read-only view, centered
    return (
      <div className="w-full max-w-lg mx-auto space-y-4">
        <div className="w-full max-w-lg space-y-4">
          <h2 className="text-2xl font-bold">Your Profile</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {resumePreview && (
            <div>
              <strong>Resume Preview:</strong>
              <img
                src={resumePreview}
                alt="Resume Preview"
                className="mt-2 max-w-full h-auto border rounded-md"
              />
            </div>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Edit Profile
          </button>
        </div>
      </div>
    );
  }

  // Edit mode, centered
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-xl space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md"
          >
            <p className="mb-2">Drag &amp; drop your resume image here, or click to select</p>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  setProfile(p => ({ ...p, resumeFile: file }));
                  setResumePreview(
                    saved.resumeUrl
                      ? `http://localhost:8080${saved.resumeUrl}`
                      : null
                  );
                }
              }}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer inline-block bg-blue-100 px-3 py-1 rounded-md text-blue-700"
            >
              Browse…
            </label>

            {resumePreview && (
              <img
                src={resumePreview}
                alt="Resume Preview"
                className="mt-4 max-w-full h-auto mx-auto"
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;