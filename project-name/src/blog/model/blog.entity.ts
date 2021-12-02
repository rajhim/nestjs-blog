
import { UserEntity } from 'src/user/model/user.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';



@Entity()
export class BlogEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default:()=> "CURRENT_TIMESTAMP" })
  createdAt: Date;
  
  @Column({ type: 'timestamp', default:()=> "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date()
  }

  @Column({ default: 0 })
  likes: string;

  @Column({nullable: true})
  headerImage: string;

  @Column({nullable: true})
  publishedDate: string;

  @Column({nullable: true})
  isPublished: string;

  @ManyToOne(() => UserEntity, user => user.blogEntries)
  author: UserEntity;

  
}
