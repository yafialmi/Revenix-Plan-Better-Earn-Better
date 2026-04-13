export const submit = async (periode, target_revenue, aov, conversion_rate, cost_per_lead, total_biaya) => {
    try {
const response = await axiosInstanceAuthenticated.post("/", {

});
return response.data
    }catch (error) {

    }
}