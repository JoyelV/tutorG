import Course from "../models/Course";
import { ICourse } from "../entities/ICourse";

export const createCourse = async (courseData: ICourse): Promise<ICourse>=> {
    const course = await Course.create(courseData);
    return course;
}
