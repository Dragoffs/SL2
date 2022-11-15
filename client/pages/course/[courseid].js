import { useRouter } from 'next/router'
import StudentFilter from "../../components/StudentFilter";
import PinnedStudents from '../../components/PinnedStudents';
import Navbar from "../../components/Navbar";
import StudentAlertBox from '../../components/StudentAlertBox';
import styles from "../../styles/Courses.module.css"
import { useEffect, useState } from 'react';
import Head from 'next/head'
import { HiChartSquareBar } from "react-icons/hi";
import { IconContext } from "react-icons";
import BarChart from "../../components/BarChart"
import PieChart from '../../components/PieChart';

export default function CoursePage(){

    const router = useRouter()
    const { courseid } = router.query
    const [pinnedStudents, setPinnedStudents] = useState([])
	const [studentList, setStudentList] = useState([])
	const [tableData, setTableData] = useState([])
	const [pieData, setPieData]  = useState([])

	useEffect(() => {   
        if (courseid){
            const endpoint = `http://localhost:8000/students/classid/${courseid}`
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
    
            fetch(endpoint, options)
            .then( res => {
                if (res == []) {
                    return []
                }
                else{
                    return res.json()
                }
            })
            .then( data => {
                setStudentList(data)
				setTableData(transformData(data))
				setPieData(pieChartData(data))
            })
        }
    }, [courseid])


    useEffect(() => {
		if (courseid){
            const endpoint = `http://localhost:8000/professors/uid/${localStorage.getItem(
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
					setPinnedStudents(data.pinned);
				});
        }
    }, [courseid])

	const transformData = (students) => {
		let newStudentList = []
		students.forEach( student => {
			let failureSuccess = countSucccessFailure(student.logs)
			let newStudent = {
				"username": student.username,
				"first_name": student.first_name,
				"last_name": student.last_name,
				"failure": failureSuccess[0],
				"success": failureSuccess[1]
			}
			newStudentList.push(newStudent)
		})
		return newStudentList
	}

	const pieChartData = (students) => {
		let success = 0
		let failure = 0
		students.forEach( student => {
			let failureSuccess = countSucccessFailure(student.logs)
			success += failureSuccess[1]
			failure += failureSuccess[0]
		})
		return [{type: 'success', value: success},{type: 'failure', value: failure}]
	}

	const countSucccessFailure = (logs) => {
		let failure = 0
		let success = 0
		logs.forEach( log => {
			if (log.result === "Failure"){
				failure += 1
			}
			else{
				success += 1
			}
		})
		return [failure, success]
	}

	const updateHappened = (studentid) => {
		if (!pinnedStudents.includes(studentid)){
			setPinnedStudents([...pinnedStudents, studentid])
		}
		else{
			//Set error message
		}
	}

	const arrayRemove = (arr, value) => { 
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
				<title>SL2 | {`${courseid}`}</title>
			</Head>
			<Navbar />
			<div className={styles.courseanalytics}>
				<div className={styles.chart}>
					<div className={styles.courseheader}>
						<button className={styles.backbutton} onClick={() => router.back()}>Back</button>
						<IconContext.Provider
							value={{ color: "#FF6F00", size: "40px" }}>
							<HiChartSquareBar />
						</IconContext.Provider>
						<h1>Selected Course Analytics: {courseid}</h1>
					</div>
                    <hr></hr>
					<div className={styles.chartcontainer}>
						<BarChart studentList={tableData}/>
						<PieChart
							data={pieData}	
							width={200}
							height={200}
							innerRadius={60}
							outerRadius={100}
						/>
					</div>
				</div>
           
                <div className={styles.studenttable}>
                    <StudentFilter 
						courseid={courseid} 
						studentList={studentList} 
						pinnedStudents={pinnedStudents} 
						update={updateHappened} 
						removed={removedHappened}
					/>
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
    )
}