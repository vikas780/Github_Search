import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import styled from 'styled-components'
import loginImg from '../images/login-img.svg'
import { FaRegSmile } from 'react-icons/fa'
const Login = () => {
  const { loginWithRedirect } = useAuth0()
  return (
    <Wrapper>
      <div className='container'>
        <img src={loginImg} alt='Github image'></img>
        <h2>Hello, Buddy please</h2>
        <button className='btn' onClick={loginWithRedirect}>
          Login / Sign Up
        </button>
        <br />
        <br />
        <h4>
          to proceed <FaRegSmile />.
        </h4>
      </div>
    </Wrapper>
  )
}
const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  .container {
    width: 90vw;
    max-width: 600px;
    text-align: center;
  }
  img {
    margin-bottom: 2rem;
  }
  h2 {
    margin-bottom: 1.5rem;
  }
`
export default Login
