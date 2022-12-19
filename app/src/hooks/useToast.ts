import useToastStore from "../stores/toast";

const useToast = () => {
	const setToast = useToastStore((store) => store.setToast);
	return setToast;
};

export default useToast;
