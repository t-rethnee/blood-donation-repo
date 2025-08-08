import React, { useEffect } from 'react';
import Banner from '../../components/Banner/Banner';
import FeaturedSection from '../../components/FeaturedSection';
import ContactUs from '../../components/ContactUs';


const Home = () => {
     useEffect(() => {
    document.title = 'RedAid | Home' // এখানে dynamic title সেট করলাম
  }, []);

    return (
        <div>
           <Banner></Banner> 
           <FeaturedSection></FeaturedSection>
           <ContactUs></ContactUs>
        </div>
    );
};

export default Home;