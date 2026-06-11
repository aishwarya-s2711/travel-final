const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Aishwarya/Downloads/tour-planning-agency-main (1)/tour-planning-agency-main/frontend/src/pages/dashboards';
const modules = ['UserProfile', 'Wishlist', 'Notifications', 'PaymentHistory', 'TravelHistory', 'Support', 'Settings'];

modules.forEach(name => {
  const content = `import React from 'react';

const ${name} = () => {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6">${name.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <p className="text-gray-600">This module is currently under development. Check back later!</p>
    </div>
  );
};

export default ${name};
`;
  fs.writeFileSync(path.join(dir, name + '.jsx'), content);
});
console.log('Done scaffolding components!');
