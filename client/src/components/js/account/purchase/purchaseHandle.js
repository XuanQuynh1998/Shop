export async function search(input) {
    const searchResult = await $.ajax({
        url: `/user_info/search?key=${input}`,
    });

    console.log(searchResult);
}
