import React, { useState } from "react";

const ContactForm = () => {
	const [form, setForm] = useState({
		name: "",
		asunt: "",
		message: "",
	});

	const handleChangeForm = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		window.location.href = `mailto:mendoza000@gmail.com?subject=${form.asunt}\-${form.name}&body=${form.message}`;
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="px-5 py-5 dark:bg-zinc-800 flex flex-col rounded-2xl shadow-xl bg-white gap-5"
		>
			<label className="flex flex-col font-semibold text-xs rounded-xl px-3 py-2 dark:bg-zinc-900 bg-zinc-100">
				Nombres
				<input
					type="text"
					name="name"
					value={form.name}
					onChange={handleChangeForm}
					className="text-base bg-transparent outline-none opacity-60"
					placeholder="Pedro Perez"
				/>
			</label>

			<label className="flex flex-col font-semibold text-xs rounded-xl px-3 py-2 dark:bg-zinc-900 bg-zinc-100">
				Asunto
				<input
					type="text"
					name="asunt"
					value={form.asunt}
					onChange={handleChangeForm}
					className="text-base bg-transparent outline-none opacity-60"
					placeholder="Landing page for my business"
				/>
			</label>

			<label className="flex flex-col font-semibold text-xs rounded-xl px-3 py-2 dark:bg-zinc-900 bg-zinc-100">
				Mensaje
				<textarea
					name="message"
					value={form.message}
					onChange={handleChangeForm}
					className="text-base bg-transparent outline-none opacity-60 resize-none"
					placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, consequatur."
					rows={10}
				/>
			</label>

			<button
				className="px-4 py-2 dark:bg-zinc-900 dark:hover:bg-zinc-900/50 bg-zinc-800 rounded-2xl gap-2 hover:gap-3 justify-center hover:bg-zinc-700 duration-200 font-semibold flex max-w-xs text-center mt-2 text-white"
				type="submit"
			>
				Enviar correo
			</button>
		</form>
	);
};

export default ContactForm;
