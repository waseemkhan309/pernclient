import React from 'react';
import VerticalCarousel from './Pages/VerticalCarousel';

// reactions: ['👍', '🤔', '👎'],
const slides = [
  {
    text: 'Do you believe the political system in Pakistan is improving?',
    reactions: ['Yes', 'No'],
  },
  {
    text: 'Should military influence in Pakistan politics be reduced?',
    reactions: ['Yes', 'No'],
  },
  {
    text: 'Is corruption the biggest challenge in Pakistan politics?',
    reactions: ['Yes', 'No'],
  },
  {
    text: 'Do you think Pakistan needs electoral reforms?',
    reactions: ['Yes', 'No'],
  },
  {
    text: 'Will Pakistan’s economy improve with better political stability',
    reactions: ['Yes', 'No'],
  },
];

const App = () => {
  return (
    <div className="App">
      <VerticalCarousel slides={slides} />
    </div>
  );
};

export default App;
