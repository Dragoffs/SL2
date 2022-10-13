import styles from "../styles/StudentAlertBox.module.css";
import { useEffect, useState } from "react";

import { RiErrorWarningFill } from "react-icons/ri";
import { IconContext } from "react-icons";

export default function StudentAlertBox(props) {
	const [students, setStudents] = useState([]);

	useEffect(() => {
		let query = makeQueryString(props.courses)
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};

		fetch(
			`http://localhost:8000/students/courses/${query}`,
			options,
		)
			.then((res) => {
				if (res.status === 200){
					return res.json()
				}
			})
			.then((data) => {
				setStudents(data);
			});
	}, [props.courses]);

	const makeQueryString = (courses) => {
		let queryString = '?'
		for (let i = 0; i < courses.length; i++){
			if (i === props.courses.length - 1){
				queryString = queryString + `course=${courses[i]}`
			}
			else{
				queryString = queryString + `course=${courses[i]}&`
			}
		}
		return queryString
	}

	const OLDcalculateFailedLogins = (logs) => {
		let count = 0
		let sortedLogs = logs.sort(function (a, b) {
			return new Date(b.datetime) - new Date(a.datetime)
		});
		
		let now = new Date(); // current date
		let weekRange = now.setDate(now.getDate() - 7) // 7 day range

		for (let i = 0; i < sortedLogs.length; i++) {
			if (new Date(sortedLogs[i].datetime) < weekRange) {
				break;
			}

			if (sortedLogs[i].result.toLowerCase() === "failure") {
				count += 1;
			}
		}

		let mostRecent = new Date(sortedLogs[0].datetime); // most recent failure
		let logins = count == 1 ? "login" : "logins";

		// interpolate into return string / tag
		return (
			<div className={styles.description}>
				<p>
					{count} failed {logins} in the past week
				</p>
				<p>
					Last Failed Login: {mostRecent.toDateString()},{" "}
					{mostRecent.toLocaleTimeString("en-US")}
				</p>
			</div>
		);
	}

	const calculateFailedLogins = (students) => {

		let result = []

		for(let student of students) {
			let count = 0
			let sortedLogs = student.logs.sort(function (a, b) {
				return new Date(b.datetime) - new Date(a.datetime)
			});
			
			let now = new Date(); // current date
			let weekRange = now.setDate(now.getDate() - 7) // 7 day range

			for (let i = 0; i < sortedLogs.length; i++) {
				if (new Date(sortedLogs[i].datetime) < weekRange) {
					break;
				}

				if (sortedLogs[i].result.toLowerCase() === "failure") {
					count += 1;
				}
			}

			let mostRecent = new Date(sortedLogs[0].datetime); // most recent failure
			let logins = count == 1 ? "login" : "logins";

			result.push({
				first_name: student.first_name,
				last_name: student.last_name,
				courses: student.courses,
				logins: logins,
				mostRecent: mostRecent,
				count: count
			})
		}

		return result.sort(function (a, b) {
			return b.count - a.count
		})
	}

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.title}>
					<IconContext.Provider
						value={{ color: "orange", size: "25px" }}
					>
						<RiErrorWarningFill />
					</IconContext.Provider>
					<h3>STUDENT ALERTS</h3>
				</div>
				<table className={styles.table}>
					<tbody>
						{
							students !== undefined ?
							calculateFailedLogins(students).map( student => (
								<tr className={styles.tablerows}>
									<td>
										<h4>{student.first_name} {student.last_name}: {student.courses.toString()}</h4>
										<div className={styles.description}>
											<p>
												{student.count} failed {student.logins} in the past week
											</p>
											<p>
												Last Failed Login: {student.mostRecent.toDateString()}, {" "}
												{student.mostRecent.toLocaleTimeString("en-US")}
											</p>
										</div>
									</td>
								</tr>

							))
							: <tr><td><p>Loading</p></td></tr>
						}
					</tbody>
				</table>
			</div>
		</div>
	);
}
