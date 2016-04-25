class AddFriendsToUser < ActiveRecord::Migration
  def self.up
    change_table(:users) do |t|
      t.integer  "friends",  default: [], array: true
    end
  end
  
  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
