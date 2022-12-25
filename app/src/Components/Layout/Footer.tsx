import { AiFillCode } from "react-icons/ai";

const Footer = () => {
	return (
		<footer className="w-full border-t mt-8 border-gray-300 text-center p-6 text-gray-500">
			<div className="flex items-center gap-1 justify-center">
				By{" "}
				<a
					href="https://github.com/deve-sh"
					target="_blank"
					rel="noopener noreferrer"
				>
					Devesh Kumar{" "}
					<AiFillCode className="inline-block text-2xl text-slate-800" />
				</a>
			</div>
		</footer>
	);
};

export default Footer;
