interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    category: string;
    courseFee: number;
    rating: number;
    students: number;
    thumbnail: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="bg-white rounded-sm shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-300">
      {/* Course Image */}
      <img
        src={course.thumbnail
        }
        alt={course.title}
        className="w-full h-40 object-cover"
      />

      {/* Course Details */}
      <div className="p-4">
        <p className="text-sm font-medium text-gray-600">{course.category}</p>
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
          {course.title}
        </h3>

        {/* Price, Rating, and Students */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-bold text-blue-500">₹{course.courseFee
          }</p>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-sm">★ {course.rating}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 flex justify-between items-center bg-gray-100 border-t">
        <button
          className="px-4 py-2 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition"
          onClick={() => onView(course._id)}
        >
          View
        </button>
        <button
          className="px-4 py-2 text-sm text-green-500 hover:bg-green-50 rounded-lg transition"
          onClick={() => onEdit(course._id)}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition"
          onClick={() => onDelete(course._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
