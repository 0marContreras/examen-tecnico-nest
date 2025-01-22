import { Table, Column, Model, DataType } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
@Table
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })

  createdAt: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); 
    return bcrypt.hash(password, salt); 
  }

  
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password); 
  }
}

