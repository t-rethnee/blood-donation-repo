import React from 'react';
import Banner from '../../components/Banner/Banner';
import FeaturedSection from '../../components/FeaturedSection';
import ContactUs from '../../components/ContactUs';

const Home = () => {
    return (
        <div>
           <Banner></Banner> 
           <FeaturedSection></FeaturedSection>
           <ContactUs></ContactUs>
        </div>
    );
};

export default Home;