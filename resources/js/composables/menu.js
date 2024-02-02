import { ref } from "vue";

export default function useMenu() {
    const menuList = ref([]);

    const getMenu = async () => {
        try {
            const response = await axios.get("/api/menu");
            menuList.value = response.data.data;
        } catch (error) {
            console.error("Error fetching menu list:", error);
            // Handle the error as needed
        }
    };

    return {
        getMenu,
    };
}
