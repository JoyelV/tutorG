const CourseDescription = () => {
  return (
    <div className="py-4">
      <h2 className="text-2xl font-semibold">Description</h2>

      <p className="text-gray-700 my-2">It gives you a huge self-satisfaction when you look at your work and say, "I made this!". I love that feeling after I'm done working on <br></br>something. When I lean back in my chair, look at the final result with a smile, and have this little "spark joy" moment. It's especially <br></br>satisfying when I know I just made $5,000.<br></br></p>

      <p> I'm an outsider to this field who hacked himself into it, somehow ending up being a sought-after professional. <br></br>That's how I'm going to teach you Web Design. So you're not demotivated on your way with needless complexity. <br></br>So you enjoy the process because it's simple and fun. So you can become a Freelance Web Designer in no time.<br></br>
      </p>

      <h3 className="text-xl font-semibold mt-4">What you will learn in this course</h3>
      <ul className="list-disc ml-6 mt-2">
        <li>How to use Figma for design...</li>
        <li>Learn Webflow basics...</li>
        {/* Add other learning points */}
      </ul>

      <h3 className="text-xl font-semibold mt-4">Who this course is for</h3>
      <ul className="list-disc ml-6 mt-2">
        <li>People who want to learn web design</li>
        <li>Praesent eget consequat elit. Duis a pretium purus</li>
        <li>Sed sagittis suscipit condimentum pellentesque vulputate feugiat libero nec accumsan</li>
        <li>Sed nec dapibus orci integer nisl turpis, eleifend sit amet aliquam vel, lacinia quis ex</li>
      </ul>
    </div>
  );
};

export default CourseDescription;
