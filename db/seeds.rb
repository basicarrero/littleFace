# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create(email: 'bender@gmail.com', password: 'topsecret', password_confirmation: 'topsecret')
User.create(email: 'leela@gmail.com', password: 'topsecret', password_confirmation: 'topsecret')
User.create(email: 'fry@gmail.com', password: 'topsecret', password_confirmation: 'topsecret')
User.create(email: 'basicarrero@hotmail.com', password: 'topsecret', password_confirmation: 'topsecret')

50.times { |i| Post.create(user_id: 1, title: "Post #{i + 1}", created_at: (50 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }
50.times { |i| Post.create(user_id: 2, title: "Post #{i + 1}", created_at: (50 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }
50.times { |i| Post.create(user_id: 3, title: "Post #{i + 1}", created_at: (50 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }
50.times { |i| Post.create(user_id: 4, title: "Post #{i + 1}", created_at: (50 - i + 1).days.ago, text: BetterLorem.p(2, false, false)) }