# == Schema Information
#
# Table name: engineers
#
#  id           :bigint           not null, primary key
#  display_name :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Engineer < ApplicationRecord
  validates :display_name, presence: true, unique: true

  def pairings(sprint = nil)
    Pairing
      .for_sprint(sprint)
      .where(member1_id: id)
      .or(
        Pairing
        .for_sprint(sprint)
        .where(member2_id: id)
      )
  end
end
