class CreateNotifs < ActiveRecord::Migration
  def change
    create_table :notifs do |t|
      t.integer  :user_id,    null: false
      t.integer  :type,       null: false
      t.integer  :receivers,  default: [], array: true
      t.string   :message
      t.timestamps null: false
    end
    
    add_index :notifs, :user_id
    
  end
end
