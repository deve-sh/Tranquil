import { BsArrowRightShort, BsGithub } from "react-icons/bs";

import Button from "../Reusables/Button";
import Image from "../Reusables/Image";

import CreateProject from "../CreateProject";

const Homepage = () => {
	return (
		<>
			<section className="homepage-section min-h-screen pt-32">
				<div className="text-center flex p-6 items-center">
					<div className="max-w-[850px] flex flex-col gap-3 justify-center m-auto">
						<h1 className="text-4xl md:text-6xl font-extrabold">
							Build In Your{" "}
							<div className="text-emerald-700 inline-block">Browser</div>
						</h1>
						<h3 className="text-2xl md:text-3xl text-slate-500 mt-6">
							A simple development environment in your browser for your
							favourite frontend templates.
						</h3>
						<h3 className="text-xl text-slate-500 mt-4">
							And guess what? It's all open-source!
						</h3>
						<div className="flex items-center justify-center mt-6 gap-4">
							<a href="#createproject">
								<Button className="py-4 px-6">
									Get Started{" "}
									<span className="text-2xl">
										<BsArrowRightShort />
									</span>
								</Button>
							</a>
							<a
								href="https://github.com/deve-sh/real-time-dev-environment"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button
									variant="ghost"
									className="py-4 px-6  text-slate-700 border-slate-600 border-2 hover:bg-white hover:scale-105"
								>
									GitHub{" "}
									<span className="text-2xl">
										<BsGithub />
									</span>
								</Button>
							</a>
						</div>
					</div>
				</div>
				<div className="homepage-section-image-wrapper w-full p-4 mb-8">
					<Image
						src="/images/v1screenshot.jpeg"
						className="w-3/4 shadow-2xl rounded-lg"
						containerClass="w-full flex justify-center items-center"
					/>
				</div>
			</section>
			<CreateProject />
		</>
	);
};

export default Homepage;
