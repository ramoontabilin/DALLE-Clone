import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'

const CreatePost = () => {
	const [generatingImg, setGeneratingImg] = useState(false)
	const [loading, setLoading] = useState(false)
	const [form, setForm] = useState({
		name: '',
		prompt: '',
		photo: '',
	})
	const navigate = useNavigate()

	const generateImage = async () => {
		if (form.prompt) {
			try {
				setGeneratingImg(true)
				const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/dalle`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ prompt: form.prompt }),
				})

				const data = await response.json()
				setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })
			} catch (error) {
				console.log(error)
			} finally {
				setGeneratingImg(false)
			}
		} else {
			alert('Please enter a prompt')
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (form.prompt && form.photo) {
			setLoading(true)
			try {
				const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/post`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(form)
				})
				await response.json()
					.then((data) => {
						console.log(data)
						navigate('/')
					})
					.catch((error) => {
						alert(error)
					})
				setLoading(false)
			} catch (error) {
				alert(error)
				setLoading(false)
			}
		} else {
			alert('Please enter a prompt and generate an image.')
		}
	}

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleRandom = () => {
		const randomPrompt = getRandomPrompt(form.prompt)
		setForm({ ...form, prompt: randomPrompt })
	}

	return (
		<section className="max-w-7xl mx-auto">
			<div>
				<h1 className='font-extrabold text-[#222328] text-3xl'>Create a post</h1>
				<p className='mt-2 text-[#666e75] max-w-[500]'>Use your imagination or grab a random prompt and bring it to life using the power of DALL-E</p>
			</div>
			<form action="" className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
				<div className="flex flex-col gap-5">
					<FormField
						labelName="Your name"
						type="text"
						name="name"
						placeholder="Timothy Waine"
						value={form.name}
						handleChange={handleChange}
					/>
					<FormField
						labelName="Prompt"
						type="text"
						name="prompt"
						placeholder="vibrant orange sunset painted the sky."
						value={form.prompt}
						handleChange={handleChange}
						isRandom
						handleRandom={handleRandom}
					/>

					<div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full h-full sm:w-96 sm:h-96 p-3 flex justify-center items-center'>
						{form.photo ? (
							<img
								src={form.photo}
								alt={form.prompt}
								className='w-full h-full object-contain'
							/>
						) : (
							<img
								src={preview}
								alt="preview"
								className='w-9/12 h-9/12 object-contain opacity-40'
							/>
						)}

						{generatingImg && (
							<div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
								<Loader />
							</div>
						)}
					</div>
				</div>
				<div className='mt-5 flex gap-5'>
					<button
						type='button'
						onClick={generateImage}
						disabled={generatingImg}
						className='text-white bg-emerald-600 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
					>
						{generatingImg ? "Generating..." : "Generate"}
					</button>
				</div>
				<div className="mt-10">
					<p className='mt-2 text-[#666e75] text-sm'>Once you are satisfied with the generated image, you can share it with the community and even download it</p>
					<button
						type='submit'
						className='mt-3 text-white bg-[#8371fc] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
						disabled={loading}
					>
						{loading ? "Sharing..." : "Share with the community"}
					</button>
				</div>
			</form>
		</section>
	)
}

export default CreatePost