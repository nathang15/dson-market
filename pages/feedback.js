import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Layout from '@/components/Layout';
import { UserContextProvider } from '../contexts/UserContext';
import Card from '@/components/Card';

function Feedback() {

    const form = useRef();
    const [emailValid, setEmailValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [text, setText] = useState('');
    const initialHeight = '150px';
    const handleTextareaInput = (e) => {
      const textarea = e.target;
      textarea.style.height = 'auto'; // Reset the height to auto
      textarea.style.height = `${Math.max(textarea.scrollHeight, parseInt(initialHeight))}px`; // Set the height to the scrollHeight or the initial height, whichever is greater
      setText(textarea.value); // Update the state with the current text content
    };

    const sendEmail = (e) => {
        e.preventDefault();
        const emailInput = form.current.from_email;
        const email = emailInput.value.trim().toLowerCase();
    
        if (!email.endsWith('@dickinson.edu')) {
          setEmailValid(false);
          setErrorMessage('Invalid email. It must end with @dickinson.edu');
          return;
        }
    
        
    
        emailjs
          .sendForm('service_m8fv33t', 'template_6o5mokq', form.current, 'xmX7czD8mgYu0y4bq')
          .then((result) => {
            form.current.from_name.value = '';
            emailInput.value = '';
            form.current.message.value = '';
        
            setEmailValid(true); // Reset email validation state
            setErrorMessage(''); // Clear any previous error message
            setText('');
            console.log(result.text);
          })
          .catch((error) => {
            console.error('Error sending email:', error);
          });
      };
    
  return (
    <Layout>
      <UserContextProvider>
        <h1 className='flex ml-8 justify-center md:text-5xl text-2xl mb-6 text-darkBG dark:text-lightBG underline decoration-red-500 -my-3 font-bold'>Project Feedback</h1>
        <div className='md:w-1/2 flex md:mx-auto ml-4'>
        <Card>
        <form className='flex flex-col justify-center' ref={form} onSubmit={sendEmail}>
            <label className='md:text-2xl text-lg mb-2 text-darkBG dark:text-lightBG'>Name</label>
            <input placeholder='Your Name' className='rounded-md dark:bg-darkBG bg-lightBG mb-4 text-darkBG dark:text-lightBG pl-2' type="text" name="from_name"/>

            <label className='md:text-2xl text-lg mb-2 text-darkBG dark:text-lightBG'>Email</label>
            <input
                className={`rounded-md dark:bg-darkBG bg-lightBG mb-4 text-darkBG dark:text-lightBG pl-2 ${
                emailValid ? '' : 'border-red-500'
                }`}
                type='email'
                name='from_email'
                placeholder='youremail@dickinson.edu'
            />
            {!emailValid && (
                <p className='text-red-500'>{errorMessage}</p>
            )}

            <label className='md:text-2xl text-lg mb-2 text-darkBG dark:text-lightBG'>Content</label>
            <textarea style={{ height: initialHeight }} value={text} onInput={handleTextareaInput} placeholder='Your Feedback' className='rounded-md dark:bg-darkBG bg-lightBG mb-4 text-darkBG dark:text-lightBG pl-2' name="message"/>

            <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
            Send
            </button>
        </form>

        </Card>
        </div>
      </UserContextProvider>
    </Layout>
  );
}

export default Feedback;
