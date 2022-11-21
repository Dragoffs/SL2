import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import PinnedStudents from "../components/PinnedStudents";
import StudentAlertBox from '../components/StudentAlertBox';
import Head from 'next/head'
import { SiHomeassistant } from "react-icons/si";
import { IconContext } from "react-icons";

export default function Home() {
	const router = useRouter();

	//This returns the professor entire object
	const [professor, setProfessor] = useState({});
	//This is the professor courses. Is an array, that contains class id as strings.
	const [courses, setCourses] = useState([]);
    const [pinnedStudents, setPinnedStudents] = useState([])

	useEffect(() => {
		if (localStorage.getItem("user_sl2")) {
			const endpoint = `${process.env.NEXT_PUBLIC_API_ROUTE}/professors/uid/${localStorage.getItem(
				"user_sl2",
			)}`;
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			};
	
			fetch(endpoint, options)
				.then( res => res.json())
				.then( data => {
					setCourses(data.courses);
					setProfessor(data);
					setPinnedStudents(data.pinned);
				});
		}
		else{
			router.replace("/login");
		}
	}, []);

	const redirectCourse = (course) => {
		router.push(`/course/${course}`)
	}

	function arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }

	const removedHappened = (studentid) => {
		setPinnedStudents(arrayRemove(pinnedStudents, studentid))
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>SL2 | Home</title>
			</Head>
			<Navbar />
			<div className={styles.dashboard}>
				<div className={styles.sectionlist}>
					<div className={styles.dashheader}>
						<IconContext.Provider
							value={{ color: "#FF6F00", size: "30px" }}>
							<SiHomeassistant />
						</IconContext.Provider>
						<h1>Your Dashboard</h1>
					</div>
					<div className={styles.sectionselect}>
						<hr></hr>

						<h2>
							Welcome back {professor.first_name}{" "}
							{professor.last_name}, you're logged in with {professor.email}{" "}
							| <b>Select Course Section to View Analytics:</b>
						</h2>
	
						{courses.map((element) => (
							<button className={styles.courselist} onClick={ () => redirectCourse(element) }>{element}</button>
						))}
					</div>
					
				</div>

				<div className={styles.alerts}>
					{/* this is for alert box */}
          			<StudentAlertBox/>
				</div>
				<div className={styles.pinned}>
					<PinnedStudents pinnedStudents={pinnedStudents} removed={removedHappened}/>
				</div>
			</div>			
		</div>
	);
}
