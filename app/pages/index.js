import { useState, useEffect } from 'react';

import { StyledLink } from '../styles/styledComponentProvider';
import CharacterCard from '../components/CharacterCard';
import LoadIndicator from '../components/LoadIndicator';
import { API_URL, IMAGE_BUCKET } from '../lib/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isHidden, setIsHidden] = useState(true);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      const res = await fetch(`${API_URL}/`);
      const json = await res.json();
      if (isSubscribed) {
        setIsLoading(false);
        setCharacters(json);
      }
    };
    fetchData();
    return () => (isSubscribed = false);
  }, []);

  const toggleHidden = () => {
    setIsHidden((prevState) => !prevState);
  };

  if (isLoading) {
    return (
      <div className='Header Main-header'>
        <LoadIndicator />
      </div>
    );
  }

  return (
    <div className='Header Main-header'>
      <img
        src={`${IMAGE_BUCKET}/marvelLogo.jpeg`}
        alt='Marvel Logo'
        width={680}
        height={180}
      />
      <StyledLink href='/add'>Add</StyledLink>
      <div className='hero-list'>
        {characters.map((character) => (
          <CharacterCard
            key={character.name}
            character={character}
            toggleHidden={toggleHidden}
            isHidden={isHidden}
          />
        ))}
      </div>
    </div>
  );
}
