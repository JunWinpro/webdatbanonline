import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to TasteTripper
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Your ultimate destination for hassle-free restaurant reservations
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <article className="prose prose-lg max-w-none">
              <h2>Discover the TasteTripper Experience</h2>
              <p>
                TasteTr   ipper is revolutionizing the way food enthusiasts connect with their favorite dining spots. 
                Our platform ensures a smooth and enjoyable experience from booking to dining, making restaurant 
                reservations easier than ever before.
              </p>
              
              <div className="w-full h-64 my-8 overflow-hidden">
                <img 
                  src="https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg" 
                  alt="TasteTripper App Screenshot" 
                  className="w-full h-full object-cover object-center rounded-lg shadow-md"
                />
              </div>

              <h3>Why Choose TasteTripper?</h3>
              <ul>
                <li>Seamless Reservations: Book your table with just a few taps.</li>
                <li>Diverse Cuisine Options: Explore a wide range of restaurants and cuisines.</li>
                <li>Real-time Availability: See up-to-date table availability across all partner restaurants.</li>
                <li>User Reviews: Make informed decisions based on genuine diner feedback.</li>
              </ul>

              <h3>Our Mission</h3>
              <p>
                At TasteTripper, we're passionate about connecting people with great dining experiences. 
                We strive to make the reservation process as enjoyable as the meal itself, ensuring that 
                every user can discover new flavors and create lasting memories.
              </p>

              <div className="w-full h-64 my-8 overflow-hidden">
                <img 
                  src="https://png.pngtree.com/background/20230519/original/pngtree-treed-reflections-at-a-sunset-hd-picture-image_2653276.jpg" 
                  alt="Happy diners using TasteTripper" 
                  className="w-full h-full object-cover object-center rounded-lg shadow-md"
                />
              </div>

              <h3>Join Our Community</h3>
              <p>
                Become a part of the TasteTripper community and stay updated on the latest features, 
                restaurant additions, and exclusive offers. Follow us on our social media channels:
              </p>
              
              <div className="flex justify-center space-x-6 my-8">
                <a href="https://facebook.com/tastetripper" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  <FaFacebook size={32} />
                </a>
                <a href="https://twitter.com/tastetripper" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                  <FaTwitter size={32} />
                </a>
                <a href="https://instagram.com/tastetripper" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                  <FaInstagram size={32} />
                </a>
              </div>

              <h3>Get in Touch</h3>
              <p>
                Have questions, suggestions, or just want to say hello? We'd love to hear from you! 
                Use the contact form below to reach out to our team.
              </p>
            </article>
          </div>
        </div>
        
        <div className="mt-12 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            {isSubmitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Thank you!</strong>
                <span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-red-600 hover:text-red-800">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};