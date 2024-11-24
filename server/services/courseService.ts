import { createCourse } from "../repositories/courseRepository";

export const addCourses = async (data:any)=>{
    try {
        let courseData = await createCourse(data);
        return courseData;
    } catch (error) {
        console.log(error);
        
    }
}