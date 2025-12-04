import logo from './logo.png'
import hero from './hero.jpg'
import salad from './salad.jpg'
import Rolls from './rolls.jpg'
import deserts from './deserts.jpg'
import cake from './cake.jpg'
import noodles from './noodles.jpg'
import vegetables from './vegetables.jpg'
import Paster from './Paster.jpg'
import sandwich from './sandwich.jpg'
import footer from './footer.png'
import parcel from './parcel.webp'

export const assets = {
    logo,
    hero,
    salad,
    Rolls,
    deserts,
    cake,
    noodles,
    vegetables,
    Paster,
    sandwich,
    footer,
    parcel
}

export const menu_list = [
    {
        menu_name: "Salad",
        menu_image: salad
    },
    {
        menu_name: "Rolls", 
        menu_image: Rolls
    },
    {
        menu_name: "Deserts",
        menu_image: deserts
    },
    {
        menu_name: "Sandwich",
        menu_image: sandwich
    },
    {
        menu_name: "Cake",
        menu_image: cake
    },
    {
        menu_name: "Noodles",
        menu_image: noodles
    },
    {
        menu_name: "Vegetables",
        menu_image: vegetables
    },
    {
        menu_name: "Paster",
        menu_image: Paster
    }
       
]

export const food_list = [
    {
        _id: "1",
        name: "Greek Salad",
        image: salad,
        price: 12.99,
        description: "A refreshing salad with tomatoes, cucumbers, olives, and feta cheese.",
        category: "Salad"
    },
    {
        _id: "2",
        name: "Baklava",
        image: deserts,
        price: 7.99,
        description: "Sweet pastry made of layers of filo filled with chopped nuts and sweetened with honey or syrup.",
        category: "Deserts"
    },
    {
        _id: "3",
        name: "Cinnamon Roll",
        image: Rolls,
        price: 4.99,
        description: "Sweet roll served commonly in Northern Europe and North America. Made with a rolled sheet of yeast-leavened dough.",
        category: "Rolls"
    },
    {
        _id: "4",
        name: "Pavlova",
        image: cake,
        price: 9.99,
        description: "Meringue-based dessert with a crisp crust and soft, light inside, usually topped with fruit and whipped cream.",
        category: "Cake"
    },
    {
        _id: "5",
        name: "Pavlova",
        image: noodles,
        price: 9.99,
        description: "Meringue-based dessert with a crisp crust and soft, light inside, usually topped with fruit and whipped cream.",
        category: "Noodles"
    },
    {
        _id: "6",
        name: "Crème Brûlée",
        image: vegetables,
        price: 8.99,
        description: "Rich custard base topped with a contrasting layer of hard caramel. A classic French dessert.",
        category: "Vegetables"
    },
    {
        _id: "7",
        name: "Caesar Salad",
        image: Paster,
        price: 12.49,
        description: "Romaine lettuce with croutons, Parmesan, anchovy-garlic dressing, and black pepper.",
        category: "Paster"
    },
    {
        _id: "8",
        name: "Waldorf Salad",
        image: sandwich,
        price: 11.99,
        description: "Classic salad of Creamy mix of apples, celery, grapes, walnuts, and mayo or yogurt on crisp lettuce leaves.",
        category: "Sandwich"
    },
]