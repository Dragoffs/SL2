import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import styles from '../styles/Navbar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import RITLogo from '../public/images/RIT_hor.png'

export default function Login(props) {
    let optionalStyles = null

    if (props.isLogin){
        optionalStyles = {
            "display": "None"
        }
    }
    else{
        optionalStyles = {
            "display": "Block"
        }
    }

    const router = useRouter()

    useEffect(() => {
        if (localStorage.getItem('user_sl2') === null){
        router.replace('/login')
        }
    }, [])

    const logout = (e) => {
        e.preventDefault()
        localStorage.clear()
        router.replace('/login')
    }

    return (
        <div>
            <div className={styles.navbar}>
                <div className={styles.left}>
                    <Link href="/"><Image src={RITLogo} alt="RIT Logo" width="100px" height="37.25px" className={styles.ritLogo}/></Link>
                    <div className={styles.verticalLine}></div>
                    <h1>Student Login Logger</h1>
                </div>
                <div className={styles.right}>
                    <button onClick={logout} className={styles.logOut} id='logOut'>Log Out</button>
                </div>
            </div>
            <div className={styles.buttomline}></div>
        </div>
    )
}