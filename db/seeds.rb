# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create(name: 'root', email: 'root@here.com', password: 'superuser', password_confirmation: 'superuser')

User.create(name: 'Bender', email: 'bender@gmail.com', password: 'topsecret', password_confirmation: 'topsecret', friends: [3,4])
User.create(name: 'Leela', email: 'leela@gmail.com', password: 'topsecret', password_confirmation: 'topsecret', friends: [2,4])
User.create(name: 'Fry', email: 'fry@hotmail.es', password: 'topsecret', password_confirmation: 'topsecret', friends: [2,3])

20.times { |i| Post.create(user_id: 2, title: "Post #{i + 1}", created_at: (25 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }
20.times { |i| Post.create(user_id: 3, title: "Post #{i + 1}", created_at: (25 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }
20.times { |i| Post.create(user_id: 4, title: "Post #{i + 1}", created_at: (25 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }
